


function socketController(io) {
    io.on("connection", async (socket) => {
        console.log("User Connected", socket.id);

        setInterval(() => {
            socket.emit("ping", { message: "ping" });
        }, 10000);
        // socket.on("message", (m) => {
        //     console.log("Message sent from client", m);
        // });
        socket.on("pong", () => {
            console.log("Receiverd pong from client");
        });
        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });

    })
}


export { socketController };