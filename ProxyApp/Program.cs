using HtmlAgilityPack;
using static System.Text.RegularExpressions.Regex;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();

var app = builder.Build();

app.Run(async context =>
{
    var proxyBaseAddress = $"{context.Request.Scheme}://{context.Request.Host}";
    var targetUrl = $"https://www.reddit.com{context.Request.Path}{context.Request.QueryString}";

    var httpClient = context.RequestServices.GetRequiredService<IHttpClientFactory>().CreateClient();
    httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");

    try
    {
        var response = await httpClient.GetAsync(targetUrl);

        if (!response.IsSuccessStatusCode)
        {
            context.Response.StatusCode = (int)response.StatusCode;
            await context.Response.WriteAsync($"Error fetching content: {response.StatusCode}");
            return;
        }

        var content = await response.Content.ReadAsStringAsync();

        var htmlDoc = new HtmlDocument();
        htmlDoc.LoadHtml(content);

        ModifyTextNodes(htmlDoc.DocumentNode, proxyBaseAddress);

        var modifiedContent = htmlDoc.DocumentNode.OuterHtml;

        context.Response.ContentType = response.Content.Headers.ContentType?.ToString() ?? "text/html";
        await context.Response.WriteAsync(modifiedContent);
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync($"Internal Server Error: {ex.Message}");
    }
});


app.Run();
return;


void ModifyTextNodes(HtmlNode node, string proxyBaseAddress)
{
    if (node.NodeType == HtmlNodeType.Text)
    {
        // Add ™ to every six-letter word
        node.InnerHtml = Replace(node.InnerHtml, @"\b\w{6}\b", match => $"{match.Value}™");
    }
    else if (node is { NodeType: HtmlNodeType.Element, Name: "a" } && node.Attributes["href"] != null)
    {
        // Replace internal links with proxy links
        var href = node.Attributes["href"].Value;
        if (href.StartsWith("https://www.reddit.com") || href.StartsWith("https://reddit.com"))
        {
            node.Attributes["href"].Value = href
                .Replace("https://www.reddit.com", proxyBaseAddress)
                .Replace("https://reddit.com", proxyBaseAddress);
        }
    }

    foreach (var child in node.ChildNodes.Where(x => x.Name is not ("head" or "style")))
    {
        ModifyTextNodes(child, proxyBaseAddress);
    }
}
