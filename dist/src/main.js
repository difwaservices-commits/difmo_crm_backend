"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const setup_1 = require("./setup");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    (0, setup_1.setupApp)(app);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT ?? 5001;
    await app.listen(port);
    console.log(`\n🚀 Server is running on: http://localhost:${port}`);
    console.log(`📝 Swagger Docs: http://localhost:${port}/api\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map