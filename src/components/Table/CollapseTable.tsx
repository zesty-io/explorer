import * as React from "react"
import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import Button from "@mui/material/Button"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { PrettyPrintJson } from "utils"
import { useTheme } from "@mui/system"
import CloseIcon from "@mui/icons-material/Close"
import * as helper from "utils"
import { CellStyle, TableContainerStyle } from "./Styles"

// dom access highlight function
function activateWorkingElement(match: string): any {
   console.log("string to test", match)
   const stringToTest: string = match.replace(/<[^>]*>?/gm, "")
   const elems = document.querySelectorAll("*")
   const workingElement: any = Array.from(elems).find(
      (v) => v.textContent == stringToTest,
   )

   workingElement.style.border = "2px orange solid"
   workingElement.setAttribute("contentEditable", true)
   workingElement.setAttribute("id", "activeEl")
   console.log("Activating", workingElement)

   return workingElement
}

const deactivateWorkingElement = async (
   workingElement: any,
   keyName: string,
   metaData: string,
   url: string | any,
   token: string | any,
   save: boolean,
) => {
   if (undefined !== workingElement) {
      // @ts-ignore
      save &&
         (await helper.handleEdit(metaData, url, token, {
            [`${keyName}`]: workingElement?.innerText,
         }))
      save && (await window.location.reload())
      console.log("Deactivating", workingElement)
      workingElement.style.border = "none"
      workingElement.setAttribute("contentEditable", false)
      workingElement.removeAttribute("id")
   }
}

// 1 edit at a time
// when click it should scroll to the div
// fetchwrapper verify if user is login
// make edit in api
interface Props {
   keyName: string
   obj: any
   workingElement: string
   setWorkingElement: (e: string) => void
   metaData: any
   url: any
   token: any
}

function Row({
   keyName,
   obj,
   workingElement,
   setWorkingElement,
   metaData,
   url,
   token,
}: Props) {
   const [showCopy, setShowCopy] = React.useState(false)
   const [clipboardCopy, setclipboardCopy] = React.useState(false)
   const [open, setOpen] = React.useState(false)
   const [text, settext] = React.useState("")

   const theme = useTheme()
   let value = ""
   let valueType = "string"

   if (typeof obj === "string") {
      value = obj
   } else {
      valueType = "object"
   }

   // @ts-ignore
   const showCloseBtn = text === workingElement?.innerText

   return (
      <React.Fragment>
         <TableRow
            sx={{
               "& > *": { borderBottom: "unset" },
               fontSize: "12px",
               fontWeight: "500",
            }}
         >
            {/* Row Data  */}
            <TableCell sx={{ width: "1rem" }}>
               <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
               >
                  {open ? <span>⬆️</span> : <span>⬇️</span>}
               </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
               {keyName}
            </TableCell>
            <TableCell align="left">{valueType}</TableCell>
            <TableCell
               align="left"
               onClick={() => {
                  helper.scrollToView("activeEl")
               }}
            >
               <span
                  onClick={(e: any) => {
                     !text && settext(e.target.textContent)
                     // @ts-ignore
                     !workingElement?.innerText &&
                        setWorkingElement(activateWorkingElement(value))
                  }}
               >
                  {value}
               </span>
               {showCloseBtn && (
                  <>
                     <Button
                        size="small"
                        onClick={() => {
                           deactivateWorkingElement(
                              workingElement,
                              keyName,
                              metaData,
                              url,
                              token,
                              false,
                           )
                           setWorkingElement("")
                           settext("")
                        }}
                     >
                        <CloseIcon />
                     </Button>

                     <Button
                        size="small"
                        onClick={() => {
                           deactivateWorkingElement(
                              workingElement,
                              keyName,
                              metaData,
                              url,
                              token,
                              true,
                           )
                           setWorkingElement("")
                           settext("")
                        }}
                     >
                        Save
                     </Button>
                  </>
               )}
            </TableCell>
            <TableCell align="left">{value.length}</TableCell>
            <TableCell
               onMouseEnter={() => setShowCopy(true)}
               onMouseLeave={() => {
                  setShowCopy(false)
                  setclipboardCopy(false)
               }}
               sx={{
                  background: theme.palette.zesty.zestyDarkBlue,
                  color: theme.palette.zesty.zestyGreen,
                  position: "relative",
               }}
            >
               <Button
                  sx={{ cursor: "pointer" }}
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => {
                     navigator.clipboard.writeText(`content.${keyName}`)
                     setclipboardCopy(true)
                     setShowCopy(false)
                  }}
               >
                  {`{content.${keyName}}`}
               </Button>
               <Box
                  sx={{
                     position: "absolute",
                     left: "0",
                     top: "0",
                  }}
               >
                  {clipboardCopy && <span>✅ Copied to clipboard!</span>}
                  {showCopy && <span>📜 Copy</span>}
               </Box>
            </TableCell>
         </TableRow>

         {/* Expanded Data */}
         <TableRow>
            <TableCell
               style={{
                  paddingBottom: 0,
                  paddingTop: 0,
                  background: theme.palette.zesty.zestyBackgroundBlue,
               }}
               colSpan={6}
            >
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                     <Table
                        sx={{
                           [`& .${tableCellClasses.root}`]: {
                              borderBottom: "none",
                           },
                        }}
                        size="medium"
                        aria-label="purchases"
                     >
                        <TableHead>
                           <TableRow>
                              <TableCell>{PrettyPrintJson({ data: obj })}</TableCell>
                           </TableRow>
                        </TableHead>
                     </Table>
                  </Box>
               </Collapse>
            </TableCell>
         </TableRow>
      </React.Fragment>
   )
}

export const CollapsibleTable = ({ metaData, data = {}, url, token, onScroll }: any) => {
   const [workingElement, setWorkingElement] = React.useState("")
   return (
      <TableContainer onScroll={onScroll} component={Paper} style={TableContainerStyle}>
         <Table aria-label="collapsible table" stickyHeader>
            {/* HEaders */}
            <TableHead>
               <TableRow>
                  <TableCell />
                  <TableCell variant="head" sx={CellStyle}>
                     Field Name
                  </TableCell>
                  <TableCell align="left" sx={CellStyle}>
                     Type
                  </TableCell>
                  <TableCell align="left" sx={CellStyle}>
                     Content Example
                  </TableCell>
                  <TableCell align="left" sx={CellStyle}>
                     Content Length
                  </TableCell>
                  <TableCell align="left" sx={CellStyle}>
                     Access Example
                  </TableCell>
               </TableRow>
            </TableHead>
            <div id="gotoTop"></div>

            {/* Table Row main  */}
            <TableBody>
               {Object.keys(data)?.map((keyName: any) => (
                  <Row
                     obj={data && data[keyName]}
                     keyName={keyName}
                     workingElement={workingElement}
                     setWorkingElement={setWorkingElement}
                     metaData={metaData}
                     url={url}
                     token={token}
                  />
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   )
}
