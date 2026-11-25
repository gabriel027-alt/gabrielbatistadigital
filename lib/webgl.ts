/**
 * A WebGL context only where the graphics card draws it (25/11/2026). Without hardware acceleration (software
 * rendering: phones without a usable GPU, and the headless browser Google's PageSpeed test runs on) every frame of the
 * point effects becomes a long task on the main thread, so the effects stay off and the photo simply shows.
 */
export function fastWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false, failIfMajorPerformanceCaveat: true });
  if (!gl) return null;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  if (/swiftshader|llvmpipe|software|softpipe/i.test(renderer)) { gl.getExtension("WEBGL_lose_context")?.loseContext(); return null; }
  return gl;
}
