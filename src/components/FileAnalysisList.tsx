import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      {analyses.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No files uploaded yet</p>
      ) : (
        analyses.map((analysis) => (
          <Card key={analysis.id} className="p-4">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8 text-gray-400" />
              <div className="flex-1">
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
          </Card>
        ))
      )}
    </div>
  );
};