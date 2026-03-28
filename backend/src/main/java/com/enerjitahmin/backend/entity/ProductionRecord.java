package com.enerjitahmin.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "production_records")
public class ProductionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @Column(nullable = false)
    private LocalDate recordDate;

    @Column(nullable = false)
    private double predictedEnergy;

    @Column(nullable = false)
    private double actualEnergy;

    public ProductionRecord() {
    }

    public ProductionRecord(Facility facility, LocalDate recordDate, double predictedEnergy, double actualEnergy) {
        this.facility = facility;
        this.recordDate = recordDate;
        this.predictedEnergy = predictedEnergy;
        this.actualEnergy = actualEnergy;
    }

    public Long getId() {
        return id;
    }

    public Facility getFacility() {
        return facility;
    }

    public void setFacility(Facility facility) {
        this.facility = facility;
    }

    public LocalDate getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }

    public double getPredictedEnergy() {
        return predictedEnergy;
    }

    public void setPredictedEnergy(double predictedEnergy) {
        this.predictedEnergy = predictedEnergy;
    }

    public double getActualEnergy() {
        return actualEnergy;
    }

    public void setActualEnergy(double actualEnergy) {
        this.actualEnergy = actualEnergy;
    }
}