import React from "react"
import { ZestyExplorer } from "./components"
import { createRoot } from "react-dom/client"
import { createZestyDiv } from "utils"
// import { dummydata } from "constants"
import * as helper from "utils/index"

if (process.env.NODE_ENV === "production") {
   console.log = () => {}
   console.error = () => {}
   console.debug = () => {}
}

console.log(" ********** Zesty live editor loaded ************ ")

export const main = (content?: any) => {
   if (!helper.canUseDOM()) {
      return null
   }
   createZestyDiv()

   const container = document.getElementById("zesty-explorer")
   const root = createRoot(container!)
   root.render(<ZestyExplorer content={content} />)
}

main()
