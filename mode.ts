import { serve } from "https://deno.land/std/http/mod.ts";
import { lookup } from "https://deno.land/x/media_types/mod.ts";

const BASE_PATH = "./";

const reqHandler = async (req: Request) => {
  const filePath = BASE_PATH + new URL(req.url).pathname;
  if (filePath === "./5") {
    const body = (await Deno.open("./index.html")).readable;
    return new Response(body, {
      headers: {
        "content-length": (await Deno.stat("./index.html")).size.toString(),
        "content-type": lookup("./index.html") || "application/octet-stream",
      },
    });
  }
  let fileSize;
  try {
    fileSize = (await Deno.stat(filePath)).size;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      const body = (await Deno.open("./404.html")).readable;
      return new Response(body, {
        headers: {
          "content-length": (await Deno.stat("./404.html")).size.toString(),
          "content-type": lookup("./404.html") || "application/octet-stream",
        },
        status: 404
      });
    }
    return new Response(null, { status: 500 });
  }
  const body = (await Deno.open(filePath)).readable;
  return new Response(body, {
    headers: {
      "content-length": fileSize.toString(),
      "content-type": lookup(filePath) || "application/octet-stream",
    },
  });
};

serve(reqHandler);
