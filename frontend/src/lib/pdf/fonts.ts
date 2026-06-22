import path from "path"

import { Font } from "@react-pdf/renderer"

let registered = false

/** PT Sans поддерживает кириллицу — у дефолтных шрифтов react-pdf её нет. */
export function registerPdfFonts() {
  if (registered) return
  Font.register({
    family: "PT Sans",
    fonts: [
      { src: path.join(process.cwd(), "src/lib/pdf/fonts/PTSans-Regular.woff") },
      {
        src: path.join(process.cwd(), "src/lib/pdf/fonts/PTSans-Bold.woff"),
        fontWeight: "bold",
      },
    ],
  })
  registered = true
}
