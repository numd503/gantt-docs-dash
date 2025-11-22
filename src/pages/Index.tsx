import { GanttViewer } from '@/components/GanttViewer';
import { Documentation } from '@/components/Documentation';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Gantt Timeline Library</h1>
          <p className="text-muted-foreground mt-2">
            A lightweight JavaScript library for rendering Gantt charts from Excel data — Built for enterprise environments
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <GanttViewer />
        <Documentation />
      </main>

      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Powered by vis-timeline and SheetJS • Minimal dependencies • MkDocs compatible</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
