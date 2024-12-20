import { createRoot } from "react-dom/client";
import { router } from "./components/routes";
import { RouterProvider } from "react-router-dom";
import { BudgetProvider } from './components/budget/BudgetContext'; 

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
<BudgetProvider>
  <RouterProvider router={router} />
</BudgetProvider>
);