import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold text-center bg-primary mt-4 w-[20%] rounded-lg py-2">
          Social Sync
        </h1>
      </div>
    </ThemeProvider>
  );
}

export default App;
