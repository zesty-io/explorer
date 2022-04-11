/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import React from "react"
import { dummydata } from "constants/index"
import Fuse from "fuse.js"
import { ContentViewer } from "../ContentViewer"
import { Headers } from "components"
import * as helper from "utils"
import { MetaViewer } from "../MetaViewer"
import { getPageData } from "services"
import { buttonStyles, zestyStyles, zestyWrapper } from "./styles"

// list of tabs to render
const tabList = [
   { id: 1, label: "Content Viewer", value: "Content Viewer" },
   { id: 2, label: "Meta Viewer", value: "Meta Viewer" },
]

// renanme content to contentData
const ZestyExplorerBrowser = ({ contentData, children }: any) => {
   const content = contentData || dummydata
   // const [modal, setModal] = React.useState(false);
   const [search, setSearch] = React.useState()
   // convert obj to dot

   // @ts-ignore
   const flaten1 = helper.flattenObj(content)

   // convert to array of objects
   const flaten2 = helper.convertToArray(flaten1)

   // generate columns for search
   const columns = flaten2.map((e) => {
      const res = Object.keys(e)
      return res.toString().replace(/.[0-9]/g, "")
   })

   // search options
   const options = {
      includeScore: true,
      useExtendedSearch: true,
      includeMatches: true,
      ignoreLocation: true,
      findAllMatches: true,
      threshold: 0,
      isCaseSensitive: false,
      minMatchCharLength: 1,
      keys: columns,
   }

   // search func
   const fuse = new Fuse([content], options)

   const result = fuse.search(search || "")

   // convert as key value pairs
   const result2 =
      result &&
      result[0]?.matches
         ?.map((e: any) => {
            return { [`${e.key}`]: e.value }
         })
         .map((e: any) => helper.deepen(e))

   // display the result of search
   const data = search ? result2 : { content }

   const [currentTab, setcurrentTab] = React.useState("Content Viewer")

   const containerStyle = {
      background: "#ddd",
      boxShadow: "0,0,5px,#333",
      borderRadius: "4px",
      width: "70vw",
      height: "85vh",
   }

   return (
      <div style={containerStyle}>
         <Headers
            children={children}
            content={content}
            setcurrentTab={setcurrentTab}
            tabs={tabList}
         />
         {currentTab === "Content Viewer" && (
            <ContentViewer data={data} search={search} setSearch={setSearch} />
         )}
         {currentTab === "Meta Viewer" && <MetaViewer />}
      </div>
   )
}

// Main ZESTY EXPLORER
export const ZestyExplorer = ({ content = {} }: any) => {
   const [open, setOpen] = React.useState(false)
   const [pageData, setPageData] = React.useState<any>("")

   const getData = async () => {
      const res: any = await getPageData()
      res && setPageData(res)
   }

   // check if content is available
   React.useEffect(() => {
      if (content && Object.keys(content).length === 0) {
         getData()
      } else {
         setPageData(content)
      }
   }, [])

   let searchObject = { ...pageData }
   // unset navigations for faster search
   delete searchObject.navigationTree
   // custom nav tree building
   delete searchObject.navigationCustom

   if (!helper.canUseDOM()) {
      return null
   }
   return (
      //@ts-ignore
      <div style={zestyWrapper}>
         {/* ZESTY LOGO  bottom right*/}
         {!open && (
            <button type="button" onClick={() => setOpen(true)} style={buttonStyles}>
               <img
                  src="https://storage.googleapis.com/brand-assets.zesty.io/zesty-io-app-icon-transparent.png"
                  width="32px"
                  height="32px"
                  alt="Zesty.io Logo"
               />
               <span style={zestyStyles}>Explorer</span>
            </button>
         )}

         {open && (
            <div>
               <ZestyExplorerBrowser contentData={searchObject}>
                  <button onClick={() => setOpen(false)}>Close</button>
               </ZestyExplorerBrowser>
            </div>
         )}
      </div>
   )
}