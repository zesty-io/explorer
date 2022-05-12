import React from "react"
// import ReactJson from "react-json-view-ssr"
// import { SearchAppBar } from "components"
import { CollapsibleTable } from "components/Table"
// import { useTheme } from "@mui/material"
interface Props {
   search: any
   data: any
   setSearch: (e: any) => void
   metaData: any
   url: any
   token: any
}

export const ContentViewer = ({
   metaData,
   data,
   search,
   setSearch,
   url,
   token,
}: Props) => {
   // const theme = useTheme()
   console.log(search, setSearch)
   return (
      <div
         style={{
            background: "background.paper",
            overflow: "auto",
            padding: "1rem 2rem",
         }}
      >
         {/* <SearchAppBar value={search} onChange={setSearch} /> */}
         <CollapsibleTable
            url={url}
            token={token}
            metaData={metaData}
            data={data.content || {}}
         />
      </div>
   )
}
