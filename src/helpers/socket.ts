import { SocketActionType, SocketEventType } from '@models';
import { JanEmployeeMasterModel } from '@oracle-models/jan/employee_master';

import socketIo from 'socket.io';

let io;
export const socket = {
    init: httpServer => {
        io = socketIo(httpServer);
        return io
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized')
        }
        return io;
    }
}

export const sendLive = async (event: SocketEventType, action: SocketActionType, headers, data = {}) => {
    const userId = headers['x-user-id'];
    const socketId = headers['x-socket-id'];
    const user = await JanEmployeeMasterModel.findByPk(userId);
    if (user) {
        data = { ...data, userId: user.EMPLOYEE_NO, userName: user.EMPLOYEE_NAME, socketId, action }
    } else {
        data = { ...data, action }
    }

    socket.getIO().emit(event, data);
}