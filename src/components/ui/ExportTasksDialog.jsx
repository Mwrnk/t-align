import React, { useState } from 'react';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { 
  exportAsCSV, 
  exportAsJSON, 
  exportAsText, 
  downloadFile, 
  getMimeType, 
  getFileExtension 
} from '@/lib/exportUtils';

const ExportTasksDialog = ({ tasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState("csv");
  const [fileName, setFileName] = useState("my-tasks");
  const [exportScope, setExportScope] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  // Get tasks to export based on scope
  const getTasksToExport = () => {
    if (exportScope === "all") {
      return tasks;
    } else if (exportScope === "completed") {
      return tasks.filter(task => task.status === "Done");
    } else if (exportScope === "pending") {
      return tasks.filter(task => task.status !== "Done");
    }
    return tasks;
  };

  const handleExport = () => {
    try {
      setIsExporting(true);
      
      // Get tasks based on selected scope
      const tasksToExport = getTasksToExport();
      
      if (tasksToExport.length === 0) {
        toast.error("No tasks to export");
        return;
      }
      
      // Generate content based on format
      let content;
      
      switch (format) {
        case "csv":
          content = exportAsCSV(tasksToExport);
          break;
        case "json":
          content = exportAsJSON(tasksToExport);
          break;
        case "text":
          content = exportAsText(tasksToExport);
          break;
        default:
          content = exportAsCSV(tasksToExport);
      }
      
      // Get MIME type and file extension
      const mimeType = getMimeType(format);
      const extension = getFileExtension(format);
      
      // Download the file
      const fullFileName = `${fileName}.${extension}`;
      downloadFile(content, fullFileName, mimeType);
      
      // Close dialog and show success message
      setIsOpen(false);
      toast.success(`${tasksToExport.length} tasks exported as ${fullFileName}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export tasks");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Download className="h-4 w-4" />
          Export Tasks
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Tasks</DialogTitle>
          <DialogDescription>
            Export your tasks in different formats for backup or sharing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="format">Export Format</Label>
            <Select 
              id="format" 
              value={format} 
              onValueChange={setFormat}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="text">Plain Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input 
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="my-tasks"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Tasks to Export</Label>
            <RadioGroup 
              value={exportScope} 
              onValueChange={setExportScope}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">All Tasks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed" className="cursor-pointer">Completed Tasks Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending" className="cursor-pointer">Pending Tasks Only</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-steel-blue hover:bg-steel-blue-dark"
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportTasksDialog; 