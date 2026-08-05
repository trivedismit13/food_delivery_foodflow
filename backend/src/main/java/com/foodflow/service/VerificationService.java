package com.foodflow.service;

import com.foodflow.model.CreatorVerification;
import com.foodflow.dto.request.VerificationRequest;
import com.foodflow.dto.request.Level2VerificationRequest;
import java.util.List;

public interface VerificationService {
    CreatorVerification getVerificationStatus(Long creatorId);
    CreatorVerification submitLevel1(Long creatorId, VerificationRequest request);
    CreatorVerification submitLevel2(Long creatorId, Level2VerificationRequest request);
    List<CreatorVerification> listPendingVerifications();
    CreatorVerification approveVerification(Long creatorId, Integer level);
    CreatorVerification rejectVerification(Long creatorId, String reason);
}
