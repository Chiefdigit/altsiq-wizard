import React from 'react';
import { FileUpload } from '@/components/FileUpload';
import { FileAnalysisList } from '@/components/FileAnalysisList';

const CsvUtils = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">CSV Analysis & Import</h1>
          <FileUpload />
        </div>
        <FileAnalysisList />
      </div>
    </div>
  );
};

export default CsvUtils;