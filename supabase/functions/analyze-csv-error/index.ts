import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { error, csvData, tableName } = await req.json();
    
    console.log('Analyzing error:', error);
    console.log('Table name:', tableName);
    
    if (!error) {
      throw new Error('Error details are required');
    }

    if (!csvData) {
      throw new Error('CSV data is required for analysis');
    }

    console.log('Sample CSV data:', csvData.slice(0, 500) + '...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant specializing in debugging CSV import issues and SQL problems. Analyze the provided error and CSV data to suggest specific fixes.'
          },
          {
            role: 'user',
            content: `I'm trying to import CSV data into a Supabase table named '${tableName}' but encountering issues.
            
Error: ${JSON.stringify(error)}

Sample of CSV data:
${csvData.slice(0, 1000)}

Please analyze the error and CSV data to:
1. Identify specific issues causing the import failure
2. Suggest concrete fixes for the data or import process
3. Provide any SQL commands needed to fix schema issues`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const aiResponse = await response.json();
    
    if (!aiResponse?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    console.log('AI Analysis:', aiResponse.choices[0].message.content);

    return new Response(
      JSON.stringify({ analysis: aiResponse.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-csv-error function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});