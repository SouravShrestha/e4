import openNextWorker from "./.open-next/worker.js";

export default {
  async fetch(request, env, ctx) {
    const response = await openNextWorker.fetch(request, env, ctx);
    
    // Create a new response to allow header modification
    const newResponse = new Response(response.body, response);
    
    // Attach the required security headers for Stockfish / SharedArrayBuffer
    newResponse.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    newResponse.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    newResponse.headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    
    return newResponse;
  }
};
