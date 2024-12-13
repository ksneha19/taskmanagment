using Microsoft.AspNetCore.SignalR;

public class TaskHub : Hub
{
    // Optional: Define methods for specific client-server interactions
    public async Task NotifyTaskUpdate(string message)
    {
        await Clients.All.SendAsync("ReceiveTaskUpdate", message);
    }
}
