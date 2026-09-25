import { serviceRepository } from "../repositories/service.repository";
import { AppError } from "../utils/AppError";

export const serviceService = {
  listActive: () => serviceRepository.findActive(),
  listAll: () => serviceRepository.findAll(),

  async create(data: { name: string; description?: string }) {
    return serviceRepository.create(data);
  },

  async update(id: string, data: { name?: string; description?: string; isActive?: boolean }) {
    const existing = await serviceRepository.findById(id);
    if (!existing) throw AppError.notFound("الخدمة غير موجودة");
    return serviceRepository.update(id, data);
  },

  async remove(id: string) {
    const existing = await serviceRepository.findById(id);
    if (!existing) throw AppError.notFound("الخدمة غير موجودة");
    const usageCount = await serviceRepository.countOperations(id);
    if (usageCount > 0) {
      throw AppError.conflict(
        "لا يمكن حذف هذه الخدمة لارتباطها بعمليات مسجلة، يمكنك تعطيلها بدلاً من ذلك"
      );
    }
    await serviceRepository.delete(id);
    return { success: true };
  },
};
