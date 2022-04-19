/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-no-target-blank */
import React from "react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { dummydata } from "constants/index"
import Fuse from "fuse.js"
import { ContentViewer, MetaViewer, JsonDataViewer } from "views/index"
import { Headers, Loader } from "components/index"
import * as helper from "utils/index"
import { getPageData } from "services/index"
import { buttonStyles, containerStyle, zestyStyles, zestyWrapper } from "./styles"
import { TabContainer } from "components/Tabs"
import Button from "@mui/material/Button"
import { Box } from "@material-ui/core"
import getTheme from "theme/index"
import { useDarkMode } from "hooks"

// list of tabs to render
const tabList = [
   { id: 1, label: "Content Viewer", value: "Content Viewer" },
   { id: 2, label: "Meta Viewer", value: "Meta Viewer" },
   { id: 3, label: "Json Data Viewer", value: "Json Data Viewer" },
]

// renanme content to contentData
const ZestyExplorerBrowser = ({ pageData, response, contentData, children }: any) => {
   const content = contentData || dummydata
   const [search, setSearch] = React.useState()

   // for loading
   const [time, settime] = React.useState(0)
   React.useEffect(() => {
      const timer = setTimeout(() => {
         if (time > 0) {
            settime(time - 1)
         }
      }, 1000)

      return () => clearTimeout(timer)
   })

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

   console.log(pageData, "This the Pagedata")

   return (
      <Box style={containerStyle}>
         <Headers children={children} content={content} response={response} />
         <TabContainer
            setcurrentTab={setcurrentTab}
            tabList={tabList}
            settime={() => settime(2)}
         />
         <div style={{ position: "relative" }}>
            {time > 0 && <Loader />}
            {currentTab === "Content Viewer" && (
               <ContentViewer data={data} search={search} setSearch={setSearch} />
            )}
            {currentTab === "Meta Viewer" && (
               <MetaViewer response={response} content={contentData} />
            )}
            {currentTab === "Json Data Viewer" && (
               <JsonDataViewer data={data} search={search} setSearch={setSearch} />
            )}
         </div>
      </Box>
   )
}

// Main ZESTY EXPLORER
export const ZestyExplorer = ({ content = {} }: any) => {
   const [open, setOpen] = React.useState(false)
   const [pageData, setPageData] = React.useState<any>("")
   const [response, setResponse] = React.useState<any>("")

   const getData = async () => {
      const { data, response } = await getPageData()
      data && setPageData(data)
      response && setResponse(response)
   }

   // check if content is available
   React.useEffect(() => {
      if (content && Object.keys(content).length === 0) {
         getData()
      } else {
         setPageData(content)
      }
   }, [])

   const searchObject = { ...pageData }
   // unset navigations for faster search
   delete searchObject.navigationTree
   // custom nav tree building
   delete searchObject.navigationCustom

   if (!helper.canUseDOM()) {
      return null
   }
   const [themeMode, themeToggler, mountedComponent] = useDarkMode()
   console.log(themeMode, mountedComponent)
   return (
      // @ts-ignore
      <div style={zestyWrapper}>
         <ThemeProvider theme={getTheme("light", themeToggler)}>
            <CssBaseline />
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
               <Box>
                  <ZestyExplorerBrowser
                     response={response}
                     pageData={pageData}
                     contentData={searchObject}
                  >
                     <Button
                        onClick={() => setOpen(false)}
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ fontSize: "12px", whiteSpace: "nowrap" }}
                     >
                        <Box paddingY={1} paddingX={2}>
                           close
                        </Box>
                     </Button>
                  </ZestyExplorerBrowser>
               </Box>
            )}
         </ThemeProvider>
      </div>
   )
}
