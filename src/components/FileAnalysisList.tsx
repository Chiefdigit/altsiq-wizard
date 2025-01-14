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

  const handleGenerateSchema = async (analysisId: string) => {
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
      // First, generate the schema
      const { data: schema, error: schemaError } = await supabase.functions.invoke<SchemaResponse>("generate-table-schema", {
        body: { 
          csvAnalysisId: analysisId,
          tableName: tableName.trim().toLowerCase()
        },
      });

      if (schemaError) throw schemaError;

      // Then create the table using the generated schema
      const { error: createError } = await supabase
        .rpc("execute_sql", { 
          sql_query: schema!.sql
        });

      if (createError) throw createError;

      toast({
        title: "Success",
        description: `Table ${tableName} schema created successfully`,
      });

      refetch();
    } catch (error) {
      console.error("Schema generation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleImportData = async (analysisId: string) => {
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
      const { error: importError } = await supabase.functions.invoke("import-csv-data", {
        body: { 
          csvAnalysisId: analysisId,
          tableName: tableName.trim().toLowerCase()
        },
      });

      if (importError) throw importError;

      toast({
        title: "Success",
        description: `Data imported successfully into table ${tableName}`,
      });

      refetch();
    } catch (error) {
      console.error("Import error:", error);
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
                        onClick={() => handleGenerateSchema(analysis.id)}
                        disabled={processingId === analysis.id}
                      >
                        Generate Schema & Create Table
                      </Button>
                      {analysis.analysis_status === 'completed' && (
                        <Button 
                          onClick={() => handleImportData(analysis.id)}
                          disabled={processingId === analysis.id}
                          variant="secondary"
                        >
                          Import Data
                        </Button>
                      )}
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