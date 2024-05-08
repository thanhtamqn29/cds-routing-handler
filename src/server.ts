import "reflect-metadata";
import express from "express";
import { createCombinedHandler } from "cds-routing-handlers";
import cds from "@sap/cds";
import { HandleMiddleware } from "./middlewares/handler.middleware";
import { getPath } from "./types/types";
export class Server {
    public static async run() {
        const app = express();

        // const hdl = createCombinedHandler({
        //     middlewares:[HandleMiddleware],
        //     handler: [__dirname + "/entities/**/*.js", __dirname + "/functions/**/*.js"],
        // });

        await cds.connect("db");
        await cds
            .serve("all")
            .in(app)
            .with((srv: getPath) => {
                if (srv.path === "/auth") {
                    const hdl = createCombinedHandler({
                        handler: [__dirname + "/entities/**/*.js", __dirname + "/functions/**/*.js"],
                    });
                    return hdl(srv);
                } else {
                    const hdl = createCombinedHandler({
                        middlewares: [HandleMiddleware],
                        handler: [__dirname + "/entities/**/*.js", __dirname + "/functions/**/*.js"],
                    });
                    return hdl(srv);
                }
            });

        // Run the server.
        const port = process.env.PORT || 3001;
        app.listen(port, async () => {
            console.info(`Server is listing at http://localhost:${port}`);
        });
    }
}

Server.run();