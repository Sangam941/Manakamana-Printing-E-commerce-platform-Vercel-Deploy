<<<<<<< HEAD
import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";
import { AppError } from "../utils/apperror";

export const getRegistrationRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.getRegistrationRequestsService();
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const createRegistrationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.createRegistrationRequestService(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getRegistrationRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { request_id } = req.params;

    const result =
      await adminService.getRegistrationRequestByIdService(request_id as string);

    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const approveRegistrationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { request_id } = req.params;

    const result =
      await adminService.approveRegistrationRequestService(request_id as string);

    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const rejectRegistrationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { request_id } = req.params;
    const { reason } = req.body;

    const result =
      await adminService.rejectRegistrationRequestService(request_id as string, reason as string | undefined);

    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};


export const getPendingDesignSubmissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.getPendingDesignSubmissionsService();
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getDesignSubmissionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { submission_id } = req.params;
    const result = await adminService.getDesignSubmissionByIdService(submission_id as string);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const approveDesignSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const adminId = req.user.id;
    const { submissionId, previewUrl } = req.body;

    if (!submissionId || !previewUrl) {
      throw new AppError("submissionId and previewUrl are required", 400);
    }

    const result = await adminService.approveDesignSubmissionService(
      adminId,
      submissionId,
      previewUrl
    );

    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const rejectDesignSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const adminId = req.user.id;
    const { submission_id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      throw new AppError("Rejection reason is required", 400);
    }

    const result = await adminService.rejectDesignSubmissionService(
      adminId,
      submission_id as string,
      reason
    );

    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getApprovedDesigns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.getApprovedDesignsService();
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getApprovedDesignByIdAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { design_id } = req.params;
    const result = await adminService.getApprovedDesignByIdAdminService(design_id as string);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const deleteApprovedDesign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { design_id } = req.params;
    const result = await adminService.deleteApprovedDesignService(design_id as string);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.loginAdminService(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const logoutAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.logoutAdminService();
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};
=======
import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";
import { AppError } from "../utils/apperror";

export const getRegistrationRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, search } = req.query;
    const result = await adminService.getRegistrationRequestsService({ 
      status: status as string, 
      search: search as string 
    });
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const createRegistrationRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await adminService.createRegistrationRequestService(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getRegistrationRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { request_id } = req.params;
    const result = await adminService.getRegistrationRequestByIdService(request_id as string);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const approveRegistrationRequest = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { request_id } = req.params;
    const admin_id = req.user.id;

    const result = await adminService.approveRegistrationRequestService(request_id as string, admin_id);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const rejectRegistrationRequest = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { request_id } = req.params;
    const admin_id = req.user.id;
    const { reason } = req.body;

    const result = await adminService.rejectRegistrationRequestService(request_id as string, admin_id, reason);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

// markCredentialsSent controller removed as fields are deleted from schema

export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getClientsService();
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getClientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await adminService.getClientByIdService(id as string);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};
>>>>>>> feat/updatedb
