import "squire-rte-mention/css/squire-rte-mention.default.css";
import { DefaultUI } from "./DefaultUI";
import { FunctionalUtils } from "./FunctionUtils";
import "squire-rte-mention/css/squire-rte-mention.default.css";

export const App = () => {
  return (
    <div class="mx-auto max-w-2xl p-2 prose prose-zinc">
      <h2 class="text-xl">Demo 1</h2>
      <p>This uses the functional API to create a very simple mention insert</p>
      <FunctionalUtils />
      <h2 class="text-xl mt-10">Demo 2</h2>
      <p>
        This is to demo the default UI helper provided by
        `squire-rte-mention/ui` when you don't wish to spend time writing one
        for very simple use cases
      </p>
      <DefaultUI />
    </div>
  );
};
