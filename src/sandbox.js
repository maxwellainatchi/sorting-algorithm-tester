const sandboxProxies = new WeakMap();

/**
 * A function to safely execute sandboxed code.
 * Taken from https://blog.risingstack.com/writing-a-javascript-framework-sandboxed-code-evaluation/#theevileval
 * @param {string} src The source code to compile into a function.
 * @returns {(obj: object) => any} A function that takes the local variables that should be in scope, and executes it.
 */
export function compileCode(src) {
  src = `with (sandbox) {\n${src}\n}`;
  const code = new Function("sandbox", src);

  return function (sandboxExtras) {
    const sandbox = { ...sandboxExtras, console };
    if (!sandboxProxies.has(sandbox)) {
      const sandboxProxy = new Proxy(sandbox, { has, get });
      sandboxProxies.set(sandbox, sandboxProxy);
    }
    return code(sandboxProxies.get(sandbox));
  };
}

function has(target, key) {
  return true;
}

function get(target, key) {
  if (key === Symbol.unscopables) return undefined;
  return target[key];
}
