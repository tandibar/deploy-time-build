var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var nodejs_build_exports = {};
__export(nodejs_build_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(nodejs_build_exports);
var import_client_codebuild = require("@aws-sdk/client-codebuild");
var cb = new import_client_codebuild.CodeBuildClient({});
var handler = async (event, context) => {
  console.log(JSON.stringify(event));
  try {
    if (event.RequestType == "Create" || event.RequestType == "Update") {
      const props = event.ResourceProperties;
      const build = await cb.send(new import_client_codebuild.StartBuildCommand({
        projectName: props.codeBuildProjectName,
        environmentVariablesOverride: [
          {
            name: "input",
            value: JSON.stringify(props.sources.map((source) => ({
              assetUrl: `s3://${source.sourceBucketName}/${source.sourceObjectKey}`,
              extractPath: source.extractPath,
              commands: (source.commands ?? []).join(" && ")
            })))
          },
          {
            name: "buildCommands",
            value: props.buildCommands.join(" && ")
          },
          {
            name: "destinationBucketName",
            value: props.destinationBucketName
          },
          {
            name: "destinationObjectKey",
            value: props.destinationObjectKey
          },
          {
            name: "workingDirectory",
            value: props.workingDirectory
          },
          {
            name: "outputSourceDirectory",
            value: props.outputSourceDirectory
          },
          {
            name: "projectName",
            value: props.codeBuildProjectName
          },
          {
            name: "responseURL",
            value: event.ResponseURL
          },
          {
            name: "stackId",
            value: event.StackId
          },
          {
            name: "requestId",
            value: event.RequestId
          },
          {
            name: "logicalResourceId",
            value: event.LogicalResourceId
          },
          ...Object.entries(props.environment ?? {}).map(([name, value]) => ({
            name,
            value
          }))
        ]
      }));
    } else {
      await sendStatus("SUCCESS", event, context);
    }
  } catch (e) {
    console.log(e);
    const err = e;
    await sendStatus("FAILED", event, context, err.message);
  }
};
var sendStatus = async (status, event, context, reason) => {
  const responseBody = JSON.stringify({
    Status: status,
    Reason: reason ?? "See the details in CloudWatch Log Stream: " + context.logStreamName,
    PhysicalResourceId: context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: false,
    Data: {}
  });
  await fetch(event.ResponseURL, {
    method: "PUT",
    body: responseBody,
    headers: {
      "Content-Type": "",
      "Content-Length": responseBody.length.toString()
    }
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
