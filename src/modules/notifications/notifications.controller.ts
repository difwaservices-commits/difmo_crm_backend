import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AbilitiesGuard } from '../access-control/abilities.guard';
import { CheckAbilities } from '../access-control/abilities.decorator';
import { Action } from '../access-control/ability.factory';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    // ─── FCM Token (no permission guard - any authenticated user can register a token) ─
    @Post('fcm-token')
    saveFcmToken(@Request() req, @Body() body: { token: string; platform?: string; deviceId?: string }) {
        return this.notificationsService.saveFcmToken(
            req.user.id,
            body.token,
            body.platform || 'web',
            body.deviceId,
        );
    }

    @Delete('fcm-token')
    removeFcmToken(@Request() req, @Body() body: { token: string }) {
        return this.notificationsService.removeFcmToken(req.user.id, body.token);
    }

    // ─── Send Notification (requires permission) ────────────────────────────────
    @Post('send')
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.Create, subject: 'notification' })
    send(@Request() req, @Body() body: any) {
        const companyId = req.user.employee?.companyId || body.companyId;
        return this.notificationsService.send({
            ...body,
            companyId,
            sentById: req.user.id,
        });
    }

    // ─── History ──────────────────────────────────────────────────────────────────
    @Get('history')
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.Read, subject: 'notification' })
    getHistory(@Query('companyId') companyId: string) {
        return this.notificationsService.getHistory(companyId);
    }

    // ─── Direct User Notifications (SQL Fallback) ─────────────────────────────────
    @Get('mine')
    getMyNotifications(@Request() req) {
        return this.notificationsService.getUserNotifications(req.user.id);
    }

    @Get('stats')
    @UseGuards(AbilitiesGuard)
    @CheckAbilities({ action: Action.Read, subject: 'notification' })
    getStats(@Query('companyId') companyId: string) {
        return this.notificationsService.getStats(companyId);
    }

    // ─── Interaction Logic ──────────────────────────────────────────────────────
    @Post('mark-read')
    markRead(@Request() req) {
        return this.notificationsService.markAllAsRead(req.user.id);
    }

    @Delete('clear')
    clearAll(@Request() req) {
        return this.notificationsService.clearAll(req.user.id);
    }
}
