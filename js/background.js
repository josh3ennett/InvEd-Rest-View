var InvestEdge = {},
    //matchUrl = new RegExp("^([^:]+)://([^/]+)/api/(.+)/?$", "gi");
    //matchUrl = new RegExp("^([^:]+)://([^/]+)/api/(.+)($|/|\\?.*)$", "gi");
    matchUrl = new RegExp("^https://.*/api/([^$\\?]+)\\??(.*)?$", "gi");

function exists(object){
    return typeof object !== "undefined" && object !== null;
}

var KEY_PUBLIC = exists(localStorage["private-key"]) ? localStorage["private-key"] : "",
    KEY_PRIVATE = exists(localStorage["public-key"]) ? localStorage["public-key"] : "",
    KEY_USER = exists(localStorage["user-key"]) ? localStorage["user-key"] : "",
    INVESTEDGE_LOGON = exists(localStorage["user-name"]) ? localStorage["user-name"] : "";

InvestEdge.Client = {
    GenerateAuthorizationHeader: function(publicKey, privateKey, userKey, resource, queryString, postData, dateStamp, httpVerb)
        {
            var stringToSign = "",
                hmacSha256,
                signatureBytes,
                signatureString = "",
                authHeader = "",

                vrb = httpVerb.toUpperCase();
                dtStmp = dateStamp.toUTCString(),
                qry = typeof queryString === "undefined" || queryString === null ? "" : queryString.toUpperCase(),
                pdata = typeof postData === "undefined" || postData === null ? "" : postData.toUpperCase();

            //Format the signing string in the format required by the API
            stringToSign =
                  vrb + "\n"
                + dtStmp + "\n"
                + userKey + "\n"
                + resource + "\n"
                + qry+ "\n"
                + pdata;

            hmacSha256 = CryptoJS.HmacSHA256(stringToSign, privateKey);

            //Generate an HMAC-SHA256 hash of the signing string and encode in HEX format
            signatureString = hmacSha256.toString().toUpperCase();

            //Format the auth header in the format it needs to be used in
            authHeader = "InvestEdge " + publicKey + ":" + signatureString;

            return authHeader;
        }
    };

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        //Loop Through Headers
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            switch(details.requestHeaders[i].name){
                case "Accepts":
                    details.requestHeaders[i].value = "application/json"
                    break;
                default:
                    details.requestHeaders.splice(i, 1);
                 break;
            }
        }

        var resource = details.url.replace(matchUrl, "$1"),
            queryString = details.url.replace(matchUrl, "$2"),
            dateStamp = new Date(),
            authHeader = InvestEdge.Client.GenerateAuthorizationHeader(
                KEY_PUBLIC
                , KEY_PRIVATE
                , KEY_USER
                , resource
                , decodeURI(queryString).toUpperCase()
                , ""
                , dateStamp
                , "GET"
            );

        if(!matchUrl.test(details.url)){
            return;
        }

        details.requestHeaders.push({
            name:"Authorization",
            value: authHeader });

        details.requestHeaders.push({
            name: "x-investedge-date",
            value: dateStamp.toUTCString()});

        details.requestHeaders.push({
            name: "x-investedge-user",
            value: INVESTEDGE_LOGON});

        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]);