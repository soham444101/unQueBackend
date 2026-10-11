


function socketController(io) {
    io.on("connection", async (socket) => {
        console.log("User Connected", socket.id);

        // setInterval(() => {
        //     socket.emit("mess", { message: "Hello, world!" });
        // }, 2000);
        socket.on("message", (m) => {
            console.log("Message sent from client", m);
        });
        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });

    })
}


export { socketController };