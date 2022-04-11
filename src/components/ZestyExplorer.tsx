/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import ReactJson from "react-json-view-ssr";
import { dummydata } from "./dummydata";
import Fuse from "fuse.js";

// convert the obj to array of objectsj
const convertToArray = (content: any) =>
  Object.entries(content).map((e: any) => {
    return { [`${e[0]}`]: e[1] };
  });
// convert obj to dot
const flattenObj = (obj: any, parent: any, res: any = {}) => {
  for (const key of Object?.keys(obj || {})) {
    const propName = parent ? parent + "." + key : key;
    if (typeof obj[key] === "object") {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};
// convert dot to object
function deepen(obj: any) {
  const result = {};

  // For each object path (property key) in the object
  for (const objectPath in obj) {
    // Split path into component parts
    const parts = objectPath.split(".");

    // Create sub-objects along path as needed
    let target: any = result;
    while (parts.length > 1) {
      const part: any = parts.shift();
      target = target[part] = target[part] || {};
    }

    // Set value at end of path
    target[parts[0]] = obj[objectPath];
  }

  return result;
}

// renanme content to contentData
const ZestyExplorerBrowser = ({ contentData, children }: any) => {
  const content = contentData || dummydata;
  // const [modal, setModal] = React.useState(false);
  const [search, setSearch] = React.useState();
  // convert obj to dot

  // @ts-ignore
  const flaten1 = flattenObj(content);

  // convert to array of objects
  const flaten2 = convertToArray(flaten1);

  // generate columns for search
  const columns = flaten2.map((e) => {
    const res = Object.keys(e);
    return res.toString().replace(/.[0-9]/g, "");
  });

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
  };

  // search func
  const fuse = new Fuse([content], options);

  const result = fuse.search(search || "");

  // convert as key value pairs
  const result2 =
    result &&
    result[0]?.matches
      ?.map((e: any) => {
        return { [`${e.key}`]: e.value };
      })
      .map((e: any) => deepen(e));

  // display the result of search
  const data = search ? result2 : { content };

  // let divStyles = {
  //   marginBottom: '4em',
  //   justifyContent: 'center',
  // };

  let searchBarStyles = {
    padding: "5px",
    margin: "10px",
    borderRadius: "28px",
  };

  let linkStyles = {
    padding: "5px",
    display: "inline-block",

    color: "#497edf",
  };

  return (
    <div
      style={{
        background: "#ddd",
        boxShadow: "0,0,5px,#333",
        borderRadius: "4px",
      }}
    >
      <div style={{ width: "80vw", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <img
            src="https://storage.googleapis.com/brand-assets.zesty.io/zesty-io-app-icon-transparent.png"
            width="22px"
            height="22px"
            alt="Zesty.io Logo"
          />
          <input
            type="text"
            placeholder="Search Content Values"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            autoFocus
            style={searchBarStyles}
          />
          <span>
            Browsing item <strong> {content.meta.web.seo_link_text} </strong>
            from the <strong>{content.meta.model_alternate_name} </strong>
            Content Model
          </span>
          <a
            style={linkStyles}
            target="_blank"
            href={`https://accounts.zesty.io/instances/${content.zestyInstanceZUID}`}
          >
            Open Zesty Account
          </a>
          <a
            style={linkStyles}
            target="_blank"
            href={`https://${content.zestyInstanceZUID}.manager.zesty.io/content/${content.meta.model.zuid}/${content.meta.zuid}`}
          >
            Open Zesty Manager
          </a>

          <a
            style={linkStyles}
            target="_blank"
            href={`https://${content.zestyInstanceZUID}.manager.zesty.io/schema/${content.meta.model.zuid}`}
          >
            Open Schema
          </a>
          {children}
        </div>
        {/* {JSON.stringify(result2)} */}
        <ReactJson
          style={{ height: "80vh", overflowY: "scroll" }}
          name={"data"}
          //@ts-ignore
          src={data}
          theme="flat"
          iconStyle="square"
          indentWidth={4}
          collapsed={false}
          displayObjectSize
          displayDataTypes={false}
          enableClipboard={true}
        />
      </div>
    </div>
  );
};

function canUseDOM() {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

const getPageData = async () => {
  let data = {
    error: true,
    production: true,
  };
  const queryString = window.location.search.substring(1);

  const uri = window.location.href + "?toJSON&" + queryString;

  // for testing only
  // const devUri =
  //   'https://www.zesty.io' +
  //   window.location.pathname +
  //   '?toJSON&' +
  //   queryString;

  // Fetch data from Zesty.io toJSON API
  const res = await fetch(uri);

  // otherwise set response to data
  if (res.status === 200) {
    data = await res.json();
  }

  return data;
};

export const ZestyExplorer = ({ content = {} }: any) => {
  const [open, setOpen] = React.useState(false);
  const [pageData, setPageData] = React.useState<any>("");

  const getData = async () => {
    const res: any = await getPageData();
    res && setPageData(res);
  };

  // check if content is available
  React.useEffect(() => {
    if (content && Object.keys(content).length === 0) {
      getData();
    } else {
      setPageData(content);
    }
  }, []);

  let searchObject = { ...pageData };
  // unset navigations for faster search
  delete searchObject.navigationTree;
  // custom nav tree building
  delete searchObject.navigationCustom;

  let buttonStyles = {
    borderRadius: "5px",
    padding: "12px 24px 12px 16px",
    background: "#1b202c",
    color: "white",
    border: "1px #5B667D solid",
    boxShadow: "3px 3px 8px rgba(0,0,0,.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  };
  let zestyStyles = {
    flex: "1",
    display: "inline-block",
    alignSelf: "center",
    marginLeft: "12px",
    fontSize: "18px",
    color: "#C7D4EA",
    letterSpacing: "1px",
    fontFamily: "'Arial Rounded MT Bold','Helvetica Rounded',Arial,sans-serif",
  };

  if (!canUseDOM()) {
    return null;
  }
  return (
    <div
      style={{
        overflow: "hidden",
        width: "auto",
        background: "transparent",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "9999999999999999",
        padding: "2rem",
      }}
    >
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={buttonStyles}
        >
          <img
            src="https://storage.googleapis.com/brand-assets.zesty.io/zesty-io-app-icon-transparent.png"
            width="32px"
            height="32px"
            alt="Zesty.io Logo"
          />
          <span style={zestyStyles}>Explorer</span>
        </button>
      )}
      {/* <ZestyExplorerBrowser content={searchObject}>
        <button onClick={() => setOpen(false)}>Close</button>
      </ZestyExplorerBrowser> */}
      {open && (
        <div>
          <ZestyExplorerBrowser contentData={searchObject}>
            <button onClick={() => setOpen(false)}>Close</button>
          </ZestyExplorerBrowser>
        </div>
      )}
    </div>
  );
};
