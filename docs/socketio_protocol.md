# SocketIO Protocol Documentation

## Data Format

All data that is sent through the socketio is emitted on **_message_** event. The data is structured as **_JSON_** and **_stringified_** before emitted. The received message must be JSON parsed (converted from string to JSON).

```json
{
    "type": string,
    "data": object
}
```

## Available Commands

### MOWER_REGISTERATION

The **MOWER_REGISTRATION** event is sent by mower to register its socket ID with the server. It has a `role` property set to `"mower"`.

```json
{
  "type": "MOWER_REGISTRATION",
  "data": {
    "role": "mower"
  }
}
```

### DRIVING_MODE

The **DRIVING_MODE** event is sent remotely by mobile application to change the driving mode. it has a `mode` property set to one of the following values:

- `auto`: The mower will navigate autonomously.
- `manual`: The mower can be controlled manually by sending commands.

```json
{
  "type": "DRIVING_MODE",
  "data": {
    "mode": "auto"
  }
}
```

### MOWER_COMMAND

The **MOWER_COMMAND** event is sent remotely by mobile application to send a command to the mower. It has an `action` property set to one of the following values:

- `start`: Start the mower.
- `stop`: Stop the mower.
- `forward`: Move the mower forward.
- `backward`: Move the mower backward.
- `left`: Move the mower left.
- `right`: Move the mower right.

```json
{
  "type": "MOWER_COMMAND",
  "data": {
    "action": "start"
  }
}
```

**_Note_**: The mower must be in `start` state and `manual` driving mode before commanding one of the following directions/actions:

- `forward`
- `backward`
- `left`
- `right`

## Error Handling

If an error occurs during socket communication, the following error messages may be emitted on **_message_** event. It has a `code` property set to one of the following values:

- `0`: Unknown error
- `1`: Invalid message format
- `10`: Mower is offline

```json
{
  "type": "ERROR",
  "data": {
    "code": 0
  }
}
```
