import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FileAnalysis {
  id: string;
  file_name: string;
  analysis_status: string;
  analysis_result: any;
  created_at: string;
}

export const FileAnalysisList = () => {
  const [analyses, setAnalyses] = useState<FileAnalysis[]>([]);

  useEffect(() => {
    const fetchAnalyses = async () => {
      const { data, error } = await supabase
        .from('csv_analysis')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyses:', error);
        return;
      }

      setAnalyses(data || []);
    };

    fetchAnalyses();

    // Subscribe to changes
    const subscription = supabase
      .channel('csv_analysis_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'csv_analysis' }, 
        fetchAnalyses
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const renderAnalysisResult = (analysis: FileAnalysis) => {
    if (!analysis.analysis_result || analysis.analysis_status !== 'completed') {
      return null;
    }

    return (
      <div className="mt-4 space-y-4">
        <div className="text-sm">
          <span className="font-medium">Total Rows:</span> {analysis.analysis_result.totalRows}
        </div>
        <div className="space-y-2">
          <span className="font-medium text-sm">Columns:</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.analysis_result.columns.map((col: any, index: number) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <div className="font-medium text-sm">{col.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Sample values:
                  <ul className="list-disc list-inside mt-1">
                    {col.sample.map((value: string, i: number) => (
                      <li key={i}>{value || '(empty)'}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      {analyses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No files uploaded yet</p>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {analyses.map((analysis) => (
            <AccordionItem key={analysis.id} value={analysis.id}>
              <Card className="p-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4 w-full">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div className="flex-1 text-left">
                      <h3 className="font-medium">{analysis.file_name}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(analysis.analysis_status)}
                      <span className="text-sm capitalize">{analysis.analysis_status}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {renderAnalysisResult(analysis)}
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};