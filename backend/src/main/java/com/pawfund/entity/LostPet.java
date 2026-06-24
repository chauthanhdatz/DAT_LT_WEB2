package com.pawfund.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lost_pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostPet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "pet_name", length = 100)
    private String petName;

    @Column(length = 50)
    private String species;

    @Column(length = 100)
    private String breed;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(length = 500)
    private String location;

    @Column(name = "location_lat")
    private Double locationLat;

    @Column(name = "location_lng")
    private Double locationLng;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    // Loại bài đăng: LOST (mất) hoặc FOUND (nhặt được)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostType postType = PostType.LOST;

    // Trạng thái: đang tìm / đã tìm được / đã đóng
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum PostType {
        LOST,  // Bài đăng mất thú
        FOUND  // Bài đăng nhặt được thú
    }

    public enum Status {
        ACTIVE,   // Đang tìm kiếm
        RESOLVED  // Đã giải quyết (tìm được / trao trả)
    }
}
