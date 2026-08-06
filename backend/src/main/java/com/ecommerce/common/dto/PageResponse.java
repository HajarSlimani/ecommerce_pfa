package com.ecommerce.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

/**
 * Remplace Page<T>/PageImpl<T> de Spring Data comme type de retour d'API et
 * comme type mis en cache. PageImpl n'a pas de constructeur par défaut et
 * n'est pas fiablement désérialisable par Jackson (donc pas cache-friendly
 * avec Redis) — ce DTO simple l'est.
 *
 * Champs alignés sur ceux d'une Page Spring Data pour que le frontend
 * n'ait rien à changer (content, totalPages, totalElements).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public static <S, T> PageResponse<T> from(Page<S> springPage, Function<S, T> mapper) {
        return PageResponse.<T>builder()
                .content(springPage.getContent().stream().map(mapper).toList())
                .page(springPage.getNumber())
                .size(springPage.getSize())
                .totalElements(springPage.getTotalElements())
                .totalPages(springPage.getTotalPages())
                .build();
    }
}
