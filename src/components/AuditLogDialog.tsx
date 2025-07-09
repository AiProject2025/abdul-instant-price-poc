import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { useScenarios } from '@/hooks/useScenarios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AuditLogDialog = () => {
  const [open, setOpen] = useState(false);
  const { auditLogs, fetchAuditLogs } = useScenarios();

  const handleOpen = () => {
    setOpen(true);
    fetchAuditLogs();
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action.toLowerCase()) {
      case 'deleted':
        return 'destructive';
      case 'restored':
        return 'default';
      case 'created':
        return 'secondary';
      case 'updated':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpen}>
          <FileText className="w-4 h-4 mr-2" />
          View User Activity Log
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Activity Log</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {auditLogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No activity logs found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Scenario Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(log.performed_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.scenario_name}
                    </TableCell>
                    <TableCell>
                      {log.user_name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.additional_data && (
                        <div className="space-y-1">
                          {log.additional_data.deleted_at && (
                            <div>Deleted at: {formatDateTime(log.additional_data.deleted_at)}</div>
                          )}
                          {log.additional_data.restored_at && (
                            <div>Restored at: {formatDateTime(log.additional_data.restored_at)}</div>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditLogDialog;