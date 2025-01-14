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

export const FileAnalysisList = () => {
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

  const handleImport = async (analysisId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('import-inflation-data', {
        body: { csvAnalysisId: analysisId },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Imported ${data.recordsImported} records successfully`,
      });

      refetch();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      completed: "default",
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
            <AccordionTrigger className="flex justify-between">
              <div className="flex items-center gap-4">
                <span>{analysis.file_name}</span>
                {getStatusBadge(analysis.analysis_status)}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(analysis.created_at).toLocaleDateString()}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-4">
                {analysis.analysis_result && (
                  <>
                    <div>
                      <h3 className="font-medium">Analysis Results:</h3>
                      <pre className="mt-2 p-4 bg-gray-100 rounded overflow-x-auto">
                        {JSON.stringify(analysis.analysis_result, null, 2)}
                      </pre>
                    </div>
                    {analysis.analysis_status !== 'imported' && (
                      <Button 
                        onClick={() => handleImport(analysis.id)}
                        className="mt-4"
                      >
                        Import to Database
                      </Button>
                    )}
                    {analysis.analysis_status === 'imported' && (
                      <div className="text-green-600">✓ Imported to database</div>
                    )}
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};