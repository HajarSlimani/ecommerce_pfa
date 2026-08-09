package com.ecommerce.catalogue.dto;

import com.ecommerce.common.enums.UnitStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUnitStatusRequest {

    @NotNull
    private UnitStatus status;
}
