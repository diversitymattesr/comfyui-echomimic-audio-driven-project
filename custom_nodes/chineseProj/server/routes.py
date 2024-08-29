from server import PromptServer
from aiohttp import web
import shutil

@PromptServer.instance.routes.get("/chineseProj/getTerminalColumns")
async def getTerminalColumn(request: web.Request) -> web.Response:
    return web.json_response({"columns": shutil.get_terminal_size().columns})