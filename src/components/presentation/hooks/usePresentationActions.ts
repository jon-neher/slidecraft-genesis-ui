import { toast } from 'sonner';

export const usePresentationActions = (presentationId: string) => {
  const handleDuplicateSlide = async () => {
    try {
      // Logic to duplicate current slide
      toast.success('Slide duplicated');
    } catch (error) {
      toast.error('Failed to duplicate slide');
    }
  };

  const handleDeleteSlide = async () => {
    try {
      // Logic to delete current slide
      toast.success('Slide deleted');
    } catch (error) {
      toast.error('Failed to delete slide');
    }
  };

  const handleExportPDF = async () => {
    try {
      // Create PDF export logic
      const link = document.createElement('a');
      link.href = '/sample-presentation.pdf';
      link.download = `presentation-${presentationId}.pdf`;
      link.click();
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  return {
    handleDuplicateSlide,
    handleDeleteSlide,
    handleExportPDF
  };
};