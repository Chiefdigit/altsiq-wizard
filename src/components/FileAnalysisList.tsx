import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SchemaResponse {
  sql: string;
}

export const FileAnalysisList = () => {
  const [tableNames, setTableNames] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: analyses, isLoading, refetch } = useQuery({
    queryKey: ["csvAnalyses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("csv_analysis")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleGenerateSchema = async (analysisId: string) => {
    const tableName = tableNames[analysisId];
    if (!tableName?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table name",
        variant: "destructive",
      });
      return;
    }

    // Sanitize table name: only allow letters, numbers, and underscores
    const sanitizedTableName = tableName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    setProcessingId(analysisId);
    try {
      // First, generate the schema
      const { data: schema, error: schemaError } = await supabase.functions.invoke<SchemaResponse>("generate-table-schema", {
        body: { 
          csvAnalysisId: analysisId,
          tableName: sanitizedTableName
        },
      });

      if (schemaError) throw schemaError;
      if (!schema?.sql) throw new Error("No schema SQL generated");

      console.log('Generated SQL:', schema.sql); // Add logging

      // Then create the table using the generated schema
      const { error: createError } = await supabase
        .rpc("execute_sql", { 
          sql_query: schema.sql
        });

      if (createError) {
        console.error('Create table error:', createError); // Add logging
        throw createError;
      }

      toast({
        title: "Success",
        description: `Table ${sanitizedTableName} schema created successfully`,
      });

      refetch();
    } catch (error: any) {
      console.error("Schema generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate schema",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleImportData = async (analysisId: string) => {
    const tableName = tableNames[analysisId];
    if (!tableName?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table name",
        variant: "destructive",
      });
      return;
    }

    const sanitizedTableName = tableName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

    setProcessingId(analysisId);
    try {
      // First try to import
      const { error: importError } = await supabase.functions.invoke("import-csv-data", {
        body: { 
          csvAnalysisId: analysisId,
          tableName: sanitizedTableName
        },
      });

      if (importError) {
        console.error('Import error:', importError);
        
        // If import fails, get the CSV data for analysis
        const { data: fileData } = await supabase.storage
          .from('csv_uploads')
          .download((analyses?.find(a => a.id === analysisId)?.file_path || ''));
        
        const csvText = await fileData?.text();
        
        // Send to OpenAI for analysis
        const { data: analysis, error: analysisError } = await supabase.functions.invoke("analyze-csv-error", {
          body: {
            error: importError,
            csvData: csvText,
            tableName: sanitizedTableName
          }
        });

        if (analysisError) throw analysisError;

        toast({
          title: "Import Failed - AI Analysis",
          description: analysis.analysis,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Data imported successfully into table ${sanitizedTableName}`,
      });

      refetch();
    } catch (error: any) {
      console.error("Import error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      completed: "default",
      imported: "default",
      error: "destructive",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Analyzed Files</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {analyses?.map((analysis) => (
          <AccordionItem key={analysis.id} value={analysis.id} className="border p-4 rounded-lg">
            <div className="flex flex-col gap-4">
              <AccordionTrigger className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
                  <span>{analysis.file_name}</span>
                  {getStatusBadge(analysis.analysis_status)}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </span>
              </AccordionTrigger>
              
              {analysis.analysis_result && (
                <div className="flex gap-4 items-center px-4">
                  <Input
                    placeholder="Enter table name"
                    value={tableNames[analysis.id] || ''}
                    onChange={(e) => setTableNames(prev => ({
                      ...prev,
                      [analysis.id]: e.target.value
                    }))}
                    className="max-w-xs"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleGenerateSchema(analysis.id)}
                      disabled={processingId === analysis.id}
                    >
                      Generate Schema & Create Table
                    </Button>
                    <Button 
                      onClick={() => handleImportData(analysis.id)}
                      disabled={processingId === analysis.id || !tableNames[analysis.id] || analysis.analysis_status !== 'completed'}
                      variant="secondary"
                    >
                      Import Data into {tableNames[analysis.id]}
                    </Button>
                  </div>
                </div>
              )}
              
              <AccordionContent className="pt-4">
                <div className="space-y-4">
                  {analysis.analysis_result && (
                    <div>
                      <h3 className="font-medium">Analysis Results:</h3>
                      <pre className="mt-2 p-4 bg-gray-100 rounded overflow-x-auto">
                        {JSON.stringify(analysis.analysis_result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};