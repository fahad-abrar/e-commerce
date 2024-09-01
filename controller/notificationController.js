import Notification from '../model/notificationModel.js'
import ErrorHandler from "../errorhandler/errHandler.js";
import cron from 'node-cron'

class NotificationController {
    static async getnotification(req, res, next) {
        try {
            // check if the the notificationis exist or not
            const notifications = await Notification.find().sort({
                createdAt: -1
            })
            if (!notifications) {
                return next(new ErrorHandler('notification is not found', 404))
            }
            // send the response
            return res.status(200).json({
                success: true,
                message: 'notification  is retrieved',
                notifications
            })


        } catch (error) {
            return next(new ErrorHandler(error.message, 500))
        }

    }

    static async updateStatus(req, res, next) {
        try {
            // retrieved the info from the request body
            const { id } = req.params

            // check if the the notificationis exist or not
            const notification = await Notification.findById(id).sort({
                createdAt: -1
            })
            if (!notification) {
                return next(new ErrorHandler('notification is not found', 404))
            }
            // update the notification
            notification?.status = 'read'
            await notification.save()

            // send the response
            return res.status(200).json({
                success: true,
                message: 'notification updated',
                notification
            })


        } catch (error) {
            return next(new ErrorHandler(error.message, 500))
        }

    }
}

// delete the notification 
cron.schedule('0 0 0 * * *', async()=>{
    const past30days = new Date(Date.now() - 30*24*60*60*1000)
    await Notification.deleteMany({status: 'read', createdAt:{$lt: past30days}})
    console.log('notification (status = read) is deleted')
})

export default NotificationController