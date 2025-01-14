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

export const FileAnalysisList = () => {
  const [tableName, setTableName] = useState("");
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

  const handleCreateTable = async (analysisId: string) => {
    if (!tableName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a table name",
        variant: "destructive",
      });
      return;
    }

    setProcessingId(analysisId);
    try {
      const { data, error } = await supabase.functions.invoke('import-inflation-data', {
        body: { 
          csvAnalysisId: analysisId,
          tableName: tableName.trim().toLowerCase()
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Table ${tableName} created successfully`,
      });

      setTableName("");
      refetch();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error.message,
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
            <AccordionTrigger className="flex justify-between items-center w-full">
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
                    <div className="flex gap-4 items-center">
                      <Input
                        placeholder="Enter table name"
                        value={tableName}
                        onChange={(e) => setTableName(e.target.value)}
                        className="max-w-xs"
                      />
                      <Button 
                        onClick={() => handleCreateTable(analysis.id)}
                        disabled={processingId === analysis.id}
                      >
                        Create Table
                      </Button>
                    </div>
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