import { useState } from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import XLSX from "xlsx";
import React from "react";
const { Dragger } = Upload;

const getHeaderRow = (sheet) => {
  const headers: any = [];
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  let C;
  const R = range.s.r;
  for (C = range.s.c; C <= range.e.c; ++C) {
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
    let hdr = "UNKNOWN " + C;
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    headers.push(hdr);
  }
  return headers;
};

const isExcel = (file) => {
  return /\.(xlsx|xls|csv)$/.test(file.name);
};

type Props = {
  uploadSuccess: any;
};

export const UploadExcel = ({ uploadSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState({
    header: null,
    results: null,
  });

  const draggerProps = () => {
    let _this = this;
    return {
      name: "file",
      multiple: false,
      accept: ".xlsx, .xls",
      onChange(info) {
        const { status } = info.file;
        if (status === "done") {
          message.success(`${info.file.name} Document upload success`);
        } else if (status === "error") {
          message.error(`${info.file.name} File upload failed`);
        }
      },
      beforeUpload(file, fileList) {
        if (!isExcel(file)) {
          message.error("Only supported upload .xlsx, .xls, .csv file");
          return false;
        }
        return true;
      },
      customRequest(e) {
        readerData(e.file).then(() => {
          e.onSuccess();
        });
      },
    };
  };

  const readerData = (rawFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const header = getHeaderRow(worksheet);
        const results = XLSX.utils.sheet_to_json(worksheet);
        generateData({ header, results });
        resolve(null);
      };
      reader.readAsArrayBuffer(rawFile);
    });
  };

  const generateData = ({ header, results }) => {
    setExcelData({ header, results });
    uploadSuccess && uploadSuccess(excelData);
  };

  return (
    <div>
      <Dragger {...draggerProps()}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
    </div>
  );
};
