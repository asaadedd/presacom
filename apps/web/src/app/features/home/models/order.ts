import { DistributorOrderDto, OutletDto } from '@presacom/models';

export interface CustomDistributorOrder extends DistributorOrderDto {
    outletDetails: OutletDto;   
}