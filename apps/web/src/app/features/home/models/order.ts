import { OutletDto } from './../../../../../../../libs/models/src/lib/outlet';
import { DistributorOrderDto } from '@presacom/models';

export interface CustomDistributorOrder extends DistributorOrderDto {
    outletDetails: OutletDto;   
}