import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';

interface SubBoxEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  subBox?: {
    id: number;
    title: string;
    status: string;
    notes?: string;
    owner?: string;
    dueDate?: Date;
  };
  initiativeId: number;
  onSuccess?: () => void;
}

export function SubBoxEditModal({
  isOpen,
  onClose,
  subBox,
  initiativeId,
  onSuccess,
}: SubBoxEditModalProps) {
  const [title, setTitle] = useState(subBox?.title || '');
  const [status, setStatus] = useState(subBox?.status || 'Not Started');
  const [notes, setNotes] = useState(subBox?.notes || '');
  const [owner, setOwner] = useState(subBox?.owner || '');
  const [dueDate, setDueDate] = useState(subBox?.dueDate ? new Date(subBox.dueDate).toISOString().split('T')[0] : '');

  const updateMutation = trpc.initiatives.updateSubBox.useMutation();
  const createMutation = trpc.initiatives.createSubBox.useMutation();

  const handleSave = async () => {
    try {
      if (subBox) {
        await updateMutation.mutateAsync({
          id: subBox.id,
          title,
          status: status as any,
          notes,
          owner,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        });
      } else {
        await createMutation.mutateAsync({
          initiativeId,
          title,
          status: status as any,
          owner,
        });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving sub-box:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{subBox ? 'Edit Sub-box' : 'Create Sub-box'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter sub-box title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="At Risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Responsible person"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes or supporting details"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || createMutation.isPending}
          >
            {updateMutation.isPending || createMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
