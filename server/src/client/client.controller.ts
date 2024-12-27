import { Controller, Patch, UseGuards, Req, Body, Get } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ClientService } from './client.service';
import { UpdateDetailsDto } from './dto/update-details.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @UseGuards(AuthGuard)
    @Get('profile')
    async profile(@Req() req: any) {
        const clientId = req.user.clientId;
        return this.clientService.getProfile(clientId);
    }

    @UseGuards(AuthGuard)
    @Patch('update-details')
    async updateDetails(@Req() req: any, @Body() body: UpdateDetailsDto) {
        const clientId = req.user.clientId;
        return this.clientService.updateDetails(clientId, body.details);
    }

    @UseGuards(AuthGuard)
    @Patch('change-password')
    async changePassword(@Req() req: any, @Body() body: ChangePasswordDto) {
        const clientId = req.user.clientId;
        return this.clientService.changePassword(clientId, body.newPassword);
    }
}