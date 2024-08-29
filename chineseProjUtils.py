from server import PromptServer
import sys

class ProgressMessage:

    _stream = None

    def __init__(self, title: str, event: str = "progressMessage") -> None:
        super().__init__()
        self._event = event
        self._title = title

    def write(self, buf: str) -> None:
        PromptServer.instance.send_sync(self._event, {
            "title": self._title,
            "message": buf
        })
        self._stream.write(buf)

    def flush(self) -> None:
        self._stream.flush()


class ProgressMessageStdout(ProgressMessage):

    _stream = sys.stdout

class ProgressMessageStderr(ProgressMessage):
    
    _stream = sys.stderr

pmo = ProgressMessageStdout(title="")
pme = ProgressMessageStderr(title="")

def setTitle(title: str) -> None:
    pmo._title = title
    pme._title = title

def unsetTitle() -> None:
    pmo._title = ""
    pme._title = ""