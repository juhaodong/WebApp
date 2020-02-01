import { History } from 'cell-router/source';
import { Session } from './Session';
import { SuppliesRequirementModel } from './SuppliesRequirement';
import { LogisticsModel } from './Logistics';
import { HotelCanStayingModel } from './HotelCanStaying';
import { ClinicModel } from './Clinic';
import { DonationRecipient } from './DonationRecipient';
import { FactoryService } from './Factory';
import { AreaModel } from './Area';

export const history = new History();
export const session = new Session();
export const suppliesRequirement = new SuppliesRequirementModel();
export const logistics = new LogisticsModel();
export const hotelCanStaying = new HotelCanStayingModel();
export const clinic = new ClinicModel();
export const donationRecipient = new DonationRecipient();
export const factory = new FactoryService();
export const area = new AreaModel();

export * from './SuppliesRequirement';
export * from './Factory';
export * from './Logistics';
export * from './HotelCanStaying';
export * from './Clinic';
export * from './DonationRecipient';
