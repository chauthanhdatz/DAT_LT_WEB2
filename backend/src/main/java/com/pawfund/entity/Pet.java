package com.pawfund.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // shelter_id nullable: cho phép user thường đăng thú lạc/nhặt được
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;

    // Người đăng (user hoặc shelter staff)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Species species;

    @Column(length = 100)
    private String breed;

    @Column(name = "age_months")
    private Integer ageMonths;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "pet_size")
    private Size size;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    // Trạng thái chi tiết theo luồng nghiệp vụ
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.AVAILABLE;

    private Boolean vaccinated = false;
    private Boolean neutered = false;

    // Thông tin sức khỏe (JSON hoặc text mô tả)
    @Column(name = "health_status", columnDefinition = "TEXT")
    private String healthStatus;

    // Lịch sử tiêm phòng (mô tả)
    @Column(name = "vaccination_info", columnDefinition = "TEXT")
    private String vaccinationInfo;

    // Vị trí địa lý
    @Column(name = "location_lat")
    private Double locationLat;

    @Column(name = "location_lng")
    private Double locationLng;

    @Column(name = "location_text", length = 500)
    private String locationText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Species { DOG, CAT, OTHER }
    public enum Gender { MALE, FEMALE }
    public enum Size { SMALL, MEDIUM, LARGE }
    public enum Status {
        RESCUING,      // Đang trong quá trình cứu hộ
        IN_TREATMENT,  // Đang điều trị
        AVAILABLE,     // Sẵn sàng nhận nuôi
        PENDING,       // Đang chờ xét duyệt đơn nhận nuôi
        ADOPTED        // Đã được nhận nuôi
    }
}
